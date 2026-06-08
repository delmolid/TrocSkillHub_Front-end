import { ApiUser, UserCardData } from '../types/UserProfile.types';
import defaultAvatar from '../assets/Ada_Lovelace.jpg';

export const mapApiUserToUserCard = (apiUser: ApiUser): UserCardData => {
  const ville = `${apiUser.city}, ${apiUser.country}`;
  const photo = defaultAvatar;

  return {
    photo: photo,
    prenom: apiUser.firstName,
    nom: apiUser.lastName,
    ville: ville,
    linkedin: undefined,
    instagram: undefined
  };
};

export const getUserDescription = (apiUser: ApiUser): string => {
  return apiUser.description ?? '';
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber;
};
