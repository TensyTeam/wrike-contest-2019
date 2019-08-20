import React from "react";


class Popup extends React.Component {
    render() {
        return (
            <div className="popup">
				<div className="popup_close_panel" onClick={() => { this.props.onPopup(false) }} />
                {this.props.popup.current === 'edit' &&
                    <div className='popup_content'>
                        <div id="edit_id"></div>
                        <form id="edit" onSubmit={(_event)=>{this.props.onEditTitle(_event)}}>
                            <input type="text" id="edit_title" required />
                            <input type="submit" className="injected_btn" value="Update"/>
                        </form>
                    </div>
                }
                {this.props.popup.current === 'download' &&
                    <div className='popup_content'>
                        <div className='text' style={{color: '#1d364c'}}>
                            <p>1) Download and unpack exTensy</p>
                            <p>2) Open chrome://extensions and switch the slider “Developer mode” in the right corner on</p>
                            <p>3) Press "Load unpacked" in the left corner</p>
                            <p>4) Browse to the unpacked extension and select the folder for your OS</p>
                            <p>5) Check that extension has installed in the top right corner</p>
                            <p>After that open any board on Wrike with at least one assigned card, press discuss button and wait while your colleague join the discussion;</p>
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default Popup;
