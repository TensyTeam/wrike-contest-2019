import React from "react";


class Popup extends React.Component {
    render() {
        return (
            <div className="popup">
                {this.props.popup.current === 'main' &&
                    <div className='popup_content'>
                        <div className='title'>Error</div>
                        <div className="popup_close" onClick={() => {this.props.onPopup(false)}}><i className="far fa-times-circle"></i></div>
                        <div className='subtitle'>Hello</div>
                    </div>
                }
            </div>
        );
    }
};

export default Popup;
