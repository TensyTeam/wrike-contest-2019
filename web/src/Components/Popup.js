import React from "react";


class Popup extends React.Component {
    render() {
        return (
            <div className="popup">
				<div className="popup_close_panel" onClick={() => { this.props.onPopup(false) }} />
                {this.props.popup.current === 'edit' &&
                    <div className='popup_content'>
                        <form id="edit" onSubmit={(_event)=>{this.props.onEditTitle(_event)}}>
                            <input type="text" id="edit_title" required />
                            <input type="submit" className="injected_btn" value="Update"/>
                        </form>
                    </div>
                }
            </div>
        );
    }
};

export default Popup;
