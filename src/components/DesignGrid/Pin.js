import Card from "../Card/Card";

const Pin = (props) => {
  const pinClass = `pin ${props.size}`;

  return (
    <div className={`${pinClass} d-flex`}>
      <Card
        id={props.id}
        isLiked={props.isLiked}
        content={props.content}
        trackName={props.trackName}
        image={props.image}
        cardClickHandler={props.cardClickHandler}
        toggleLike={props.toggleLike}
        isBookmarked={props.isBookmarked}
      />
    </div>
  );
};

export default Pin;
