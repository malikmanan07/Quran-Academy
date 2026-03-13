import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getMyChildren = () => http.get(API.PARENT_CHILDREN);
export const getChildProgress = (id) => http.get(API.PARENT_CHILD_PROGRESS(id));
export const getChildPayments = (id) => http.get(API.PARENT_CHILD_PAYMENTS(id));
export const getChildClasses = (id) => http.get(API.PARENT_CHILD_CLASSES(id));
export const getChildAttendance = (id) => http.get(API.PARENT_CHILD_ATTENDANCE(id));
export const linkParent = (data) => http.post(API.ADMIN_LINK_PARENT, data);
export const getAllParents = () => http.get(API.ADMIN_ALL_PARENTS);
