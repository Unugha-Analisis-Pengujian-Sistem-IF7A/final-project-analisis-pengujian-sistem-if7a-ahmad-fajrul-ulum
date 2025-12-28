import PropTypes from "prop-types";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className=" flex flex-col items-center justify-center min-h-[200px] gap-4 text-center">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className=" text-base-content/70">{message}</p>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

export default Loading;
