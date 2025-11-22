function drawDeckbyApi() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
  );
  xhr.responseType = "json";
  xhr.send();
  xhr.onload = () => {
    const deckId = xhr.response.deck_id;
    console.log(deckId);
    return deckId;
    // console.log(xhr.response);
  };
}

export { drawDeckbyApi };
