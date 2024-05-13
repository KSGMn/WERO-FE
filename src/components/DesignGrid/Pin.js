import Card from "../Card/Card";

const Pin = (props) => {
  const pinClass = `pin ${props.size}`;

  return (
    <div className={`${pinClass} d-flex`}>
      <Card
        mainfeed_id={props.mainfeed_id}
        isLiked={props.isLiked}
        content={props.content}
        trackName={props.trackName}
        cardClickHandler={props.cardClickHandler}
        toggleLike={props.toggleLike}
      />
    </div>
  );
};

export default Pin;
