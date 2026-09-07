// Entity property names. Deliberately omits the `content` longtext column so
// list payloads stay small; single-post endpoints return it separately.
export const POST_LIST_COLUMNS = [
  'id',
  'imageUrl',
  'homeImageUrl',
  'title',
  'status',
  'adminId',
  'description',
  'readers',
  'categoryName',
  'postBy',
  'slug',
  'tag',
  'createdDate',
  'updatedDate',
] as const;

export const POST_LIST_SELECT = POST_LIST_COLUMNS.map(
  (column) => `posts.${column}`,
);

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
