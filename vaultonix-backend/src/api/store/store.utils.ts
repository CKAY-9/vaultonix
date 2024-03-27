import { prisma } from '../prisma';

export const initializeStoreData = async () => {
  const insert = await prisma.itemStore.create({});
  return insert;
};
