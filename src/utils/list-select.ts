export const POST_LIST_SELECT = [
  'posts.id',
  'posts.imageUrl',
  'posts.homeImageUrl',
  'posts.title',
  'posts.status',
  'posts.adminId',
  'posts.description',
  'posts.readers',
  'posts.categoryName',
  'posts.postBy',
  'posts.slug',
  'posts.tag',
  'posts.createdDate',
  'posts.updatedDate',
] as const;

export const STAFF_LIST_SELECT = [
  'StaffContact.id',
  'StaffContact.profilePicUrl',
  'StaffContact.name',
  'StaffContact.nameTH',
  'StaffContact.nickname',
  'StaffContact.company',
  'StaffContact.department',
  'StaffContact.division',
  'StaffContact.ipPhone',
  'StaffContact.email',
  'StaffContact.position',
  'StaffContact.staffId',
  'StaffContact.status',
  'StaffContact.birthDate',
  'StaffContact.createdBy',
  'StaffContact.createdDate',
  'StaffContact.updatedDate',
] as const;

export const MEETING_STAFF_SELECT = [
  'staffContactDetail.id',
  'staffContactDetail.name',
  'staffContactDetail.nameTH',
  'staffContactDetail.nickname',
  'staffContactDetail.position',
] as const;
