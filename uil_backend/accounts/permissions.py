from authorization.constants import (
    CAN_UPDATE_USER_STATUS,
    CAN_UPDATE_USER,
    CAN_UPLOAD_USER,
    CAN_READ_USER,
    CAN_DELETE_USER,
    CAN_RESEND_CREDENTIALS,
    CAN_VIEW_USER_SUMMARY_DASHBAORD,
)


USER_REQUIRED_PERMISSIONS = {
    'list': [CAN_READ_USER],
    'retrieve': [CAN_READ_USER],
    'destroy': [CAN_DELETE_USER],
    'update': [CAN_UPDATE_USER],
    'partial_update': [CAN_UPDATE_USER],
    'upload_users_excel': [CAN_UPLOAD_USER],
    'resend_credentials': [CAN_RESEND_CREDENTIALS],
    'patch_status': [CAN_UPDATE_USER_STATUS],
    'dashboard_summary': [CAN_VIEW_USER_SUMMARY_DASHBAORD],
    'first_time_change_password': [],
    'create': [],
    'password_reset': [],
    'password_reset_confirm': [],
    'activate_user_from_email': [],
    'token_create': [],
    'user_create': [CAN_UPLOAD_USER],
    'user_delete': [CAN_DELETE_USER],
    'user': [CAN_READ_USER],
    'destroy': [CAN_DELETE_USER],
    'token_destroy': [CAN_READ_USER],
}
