
const insertRole = async (roleName) => {
  try {
    const roleExists = await db.Role.findOne({where: {roleName}});
    if (roleExists) {
      return false;
    }
    await db.Role.create({roleName});
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const RoleService = {
  insertRole,
};
export default RoleService;
