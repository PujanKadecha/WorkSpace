const prisma = require("../lib/prisma");

const createWorkspace = async ({ name, userId }) => {
  return prisma.workspace.create({
    data: {
      name,
      ownerId: userId,
      documents: {
        create: {
          title: "Welcome Document",
          content: "Welcome to the First Document",
        },
      },
    },
  });
};

const getUserWorkspace = async (userId) => {
  return prisma.workspace.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      documents: true,
    },
  });
};

const deleteWorkspace = async ({ workspaceId, userId }) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    const error = new Error("Workspace not found");
    error.status = 404;
    throw error;
  }
  if (workspace.ownerId !== userId) {
    const error = new Error("Not authorized to delete this workspace");
    error.status = 403;
    throw error;
  }

  await prisma.document.deleteMany({ where: { workspaceId } });
  await prisma.workspace.delete({ where: { id: workspaceId } });
};

module.exports = { createWorkspace, getUserWorkspace, deleteWorkspace };



