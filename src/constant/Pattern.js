import { v4 as uuidv4 } from 'uuid';
export const patterns = {
  imagePatterns: /\.(jpg|jpeg|png|gif|mp4|avi|mkv|mov|wmv)$/i,
};


export const generateOrderId = () => {
  const uuid = uuidv4();
  return `ORD-${uuid.slice(0, 6)}`;
};
