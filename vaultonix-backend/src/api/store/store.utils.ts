import { prisma } from '../prisma';

export const initializeStoreData = async () => {
  const insert = await prisma.itemStore.create({});
  return insert;
};

export const getStoreItemFromID = async (item_id: number) => {
  const item = await prisma.itemStoreEntry.findUnique({
    where: {
      id: Number.parseInt(item_id.toString())
    }
  });
  return item;
}
