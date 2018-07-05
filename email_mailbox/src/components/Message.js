import React from 'react';
import PropTypes from 'prop-types';
import './message.css';

const Message = props => (
  <div className="message-container">{renderMessageType(props.message)}</div>
);

const MessageStandard = props => {
  const isTypeSuggestion = props.type === MessageType.SUGGESTION;
  return (
    <div className={`message-content ${defineMessageClass(props.type)}`}>
      <span className="message-description">{props.description}</span>
      {!!props.action && (
        <button>
          <span>{props.action}</span>
          <i className="icon-arrow-right" />
        </button>
      )}
      {isTypeSuggestion && (
        <button className="message-close">
          <i className="icon-exit" />
        </button>
      )}
    </div>
  );
};

const MessageQuestion = props => (
  <div className="message-content message-question">
    <span className="message-description">{props.ask}</span>
    <div className="message-buttons">
      <button>
        <span>Yes</span>
      </button>
      <span>-</span>
      <button>
        <span>No</span>
      </button>
    </div>
  </div>
);

const renderMessageType = props => {
  if (
    props.type === MessageType.ADVICE ||
    props.type === MessageType.SUGGESTION ||
    props.type === MessageType.SUCCESS ||
    props.type === MessageType.ERROR ||
    props.type === MessageType.NETWORK
  ) {
    return <MessageStandard {...props} />;
  } else if (props.type === MessageType.QUESTION) {
    return <MessageQuestion {...props} />;
  }
  return null;
};

const defineMessageClass = type => {
  switch (type) {
    case MessageType.ADVICE:
      return 'message-advice';
    case MessageType.SUGGESTION:
      return 'message-suggestion';
    case MessageType.SUCCESS:
      return 'message-success';
    case MessageType.ERROR:
      return 'message-error';
    case MessageType.NETWORK:
      return 'message-network';
    default:
      break;
  }
};

const MessageType = {
  ADVICE: 1,
  SUGGESTION: 2,
  QUESTION: 3,
  SUCCESS: 4,
  ERROR: 5,
  NETWORK: 6
};

renderMessageType.propTypes = {
  type: PropTypes.number
};

MessageStandard.propTypes = {
  action: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.number
};

MessageQuestion.propTypes = {
  ask: PropTypes.string
};

Message.propTypes = {
  message: PropTypes.object
};
export { Message as default, MessageType };
