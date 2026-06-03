import API from "./api";


export const getAdminDashboardStats = () => API.get("/admin/stats");


export const getAllUsers = () => API.get("/admin/users");
export const getAllPatients = () => API.get("/admin/patients");

export const deleteUser = (id) => { return API.delete(`/admin/users/${id}`); };


export const getAllDoctors = () => API.get("/admin/doctors");
export const updateDoctor = (id, doctorData) => API.put(`/admin/doctors/${id}`, doctorData);


export const getAllSubscriptions = () => API.get('/subscriptions/all');
export const getSupportTickets = () => API.get("/admin/tickets");
export const updateSupportTicket = (id, newStatus) => { return API.put(`/admin/tickets/${id}/status`, newStatus);};