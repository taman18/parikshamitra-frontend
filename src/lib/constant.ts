
export const STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
}

export const API_URIS = {
    auth: {
        login: "admin/auth/login",
        register: "admin/auth/register",
        logout: "admin/auth/logout",
        getUserByEmail: "admin/auth/get-user-by-email"

    },
    tests: {
        getTests: 'admin/test/get-test',
        deleteTest: 'admin/test/delete-test',
        getTestsInfoByUserId: 'admin/test/get-test-by-userId',
    },
    users: {
        getAllUsers: 'admin/user/all-users',
        updateUserStatus: 'admin/user/update-status'
    },
    dashboard: {
        getTilesInfo: 'admin/user/get-dashboard-tiles-info'
    }
}

export const ADMIN_USER_ID = "6819df636aa58e49ccc03eaa"

export const RANGES = [
    {
      value: "day",
      label: "Day",
    },
    {
      value: "week",
      label: "Week",
    },
    {
      value: "month",
      label: "Month",
    },
    {
      value: "year",
      label: "Year",
    },
  ];