const User = require("../models/User");

// Função para criar um novo usuário
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
    throw error;
  }
};

// Função para buscar um usuário pelo UUID
const getUserByUuid = async (uuid) => {
  try {
    const user = await User.findOne({ uuid });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  } catch (error) {
    console.error("Erro ao buscar o usuário:", error);
    throw error;
  }
};

// Função para atualizar um usuário pelo UUID
const updateUserByUuid = async (uuid, updateData) => {
  try {
    const user = await User.findOneAndUpdate({ uuid }, updateData, {
      new: true, // Retorna o usuário atualizado
      runValidators: true, // Valida as modificações
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUuid,
  updateUserByUuid,
};
