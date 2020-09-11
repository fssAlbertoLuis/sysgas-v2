import { Revenue } from "./ActionTypes";

const insertRevenue = (revenue) => ({
  type: Revenue.INSERT,
  payload: revenue,
});

const updateRevenuesList = (revenues) => ({
  type: Revenue.UPDATE,
  payload: revenues,
});

const RevenueActions = {insertRevenue, updateRevenuesList};

export default RevenueActions;
