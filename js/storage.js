const Storage = {
  savePlacementResult(result) {
    localStorage.setItem(
      "mijnNederlandsPlacement",
      JSON.stringify(result)
    );
  },

  getPlacementResult() {
    const result = localStorage.getItem(
      "mijnNederlandsPlacement"
    );

    return result ? JSON.parse(result) : null;
  },

  clearPlacementResult() {
    localStorage.removeItem(
      "mijnNederlandsPlacement"
    );
  }
};