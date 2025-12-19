import type { FastifyPluginAsync } from 'fastify';

import { ensureAuth } from '~/features/auth';
import { getClerkClient } from '~/utils/clerk';
import { BadRequestError, NotFoundError } from '~/utils/errors';

const invoices: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * Get all members and invitations
   */
  fastify.get('/', async function (req) {
    const auth = await ensureAuth(req);

    // Get members and invitations from Clerk
    const clerk = getClerkClient();
    const filter = { organizationId: auth.orgId };
    const members = await clerk.organizations.getOrganizationMembershipList(filter);
    const invitations = await clerk.organizations.getOrganizationInvitationList(filter);

    // TODO: paginate
    const data = {
      members: members.data,
      invitations: invitations.data,
    };

    return { data };
  });

  /**
   * Invite a new member
   */
  fastify.post<{ Body: { email: string; role?: string } }>('/', async function (req) {
    const auth = await ensureAuth(req);

    // Validation
    // TODO: maybe use zod
    const email = req.body.email;
    const role = req.body.role || 'member';
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    // Create invitation in Clerk
    const clerk = getClerkClient();
    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId: auth.orgId,
      emailAddress: email,
      role,
    });

    return { success: true, data: invitation };
  });

  /**
   * Remove a member or invitation
   */
  fastify.delete<{ Params: { id: string } }>('/:id', async function (req) {
    const auth = await ensureAuth(req);

    // Check if the member exists
    const clerk = getClerkClient();
    const filter = { organizationId: auth.orgId };
    const list = await clerk.organizations.getOrganizationMembershipList(filter);
    const member = list.data.find((m) => m.id === req.params.id);
    if (member) {
      await clerk.organizations.deleteOrganizationMembership({
        organizationId: auth.orgId,
        userId: req.params.id,
      });
      return { success: true };
    }

    // Check if the invitation exists
    const invitationFilter = { ...filter, invitationId: req.params.id };
    const invitation = await clerk.organizations.getOrganizationInvitation(invitationFilter);
    if (invitation) {
      await clerk.organizations.revokeOrganizationInvitation({
        organizationId: auth.orgId,
        invitationId: req.params.id,
      });
      return { success: true };
    }

    // If neither exists, throw 404
    throw new NotFoundError('Member not found');
  });
};

export default invoices;
