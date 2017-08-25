const reducer = (state = [], action) => {
  console.log('Processing action', action);
  switch (action.type) {
    case 'hey':
      return {hey: 'heystatechanged'};
    default:
      return state
  }
}

export default reducer;
