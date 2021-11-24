import React from 'react';

const AdminCustomersPanel = (props) => {
    return(
        <div id="all-customers">
            <div className="row-flex label-input-box" id="seach-person-box">
                <p className="label medium-text">Search Person by username</p>
                <input type="text" className="medium-text" id="input-search-text" placeholder="Enter username here"/>
            </div>
            <table id="all-customers-table">
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Addiction Kind</th>
                    <th>Phone Number</th>

                    <th>Doctor</th>

                    <th>Links</th>
                </tr>

            </table>
        </div>

)
}

export default AdminCustomersPanel;