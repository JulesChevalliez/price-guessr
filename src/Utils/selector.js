export const selectProduct = (state) => state.product.product;

export const selectGameProduct = (state) => state.game.product;

export const selectGameStatus = (state) => state.game.game_status;

export const selectGamesHistory = (state) => state.game.history;

export const selectTimer = (state) => state.game.settings.timer;

export const selectDifficulty = (state) => state.game.settings.difficulty;

export const selectProductImages = (state) => state.product.product.images