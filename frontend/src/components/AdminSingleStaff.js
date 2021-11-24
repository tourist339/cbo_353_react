import React from 'react';

const AdminSingleStaff = (props) => {

    return(

        <div className="col-flex" id="staff-main-box">
            <div id="update-staff">
                <p className="large-text underline">Staff Information</p>

                <form id="update-staff-form" className="row-flex">
                    <div className="label-input-box">
                        <p className="label medium-text">First Name</p>
                        <input type="text" id="first-name" name="first_name" className="medium-text"/>
                    </div>
                    <div className="label-input-box">
                        <p className="label medium-text">Last Name</p>
                        <input type="text" id="last-name" name="last_name" className="medium-text"/>
                    </div>

                    <div className="label-input-box">
                        <p className="label medium-text">Addiction Speciality</p>
                        <select id="addiction-speciality" name="speciality" className="medium-text"></select>
                    </div>
                </form>
                <p className="para-text" id="staff-add-err"></p>
                <button id="submit-add-staff" className="classic-btn auto-left">Update</button>
            </div>
            <div id="add-patient">
                <p className="large-text underline">Add Patient</p>
                <form id="add-patient-form" className="row-flex">
                    <div className="label-input-box row-flex">
                        <p className="label medium-text">Username:</p>
                        <input type="text" id="review-patient-username" className="medium-text"/>
                    </div>
                    <input type="button" id="review-patient-btn" className="classic-btn" value="Review"/>
                </form>

                <div id="searched-patient-box">

                </div>
            </div>
            <div id="all-patients">
                <p className="large-text underline">Patients Assigned</p>
                <table id="all-patients-table">

                </table>
            </div>
        </div>

)
}

export default AdminSingleStaff;