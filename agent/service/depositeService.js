import pool from '../../database/db';
import {deleteFile} from '../../helpers/folderhandle';
import ErrorResponse from '../../errorHandler/errorResponse';
import httpStatus from 'http-status';



const createDeposit = async (req, res, next) => {
    try {
        // Destructure req.user with default values as empty objects if req.user is undefined
        console.log(req.is_staff)
        const platform = 'B2B'

        let deposit_by = 'agent'
        let staff_id = null
        //console.log(req.user)
        let agentId = req.id;
        if (req.user && req.is_staff) {

            // console.log(req.user.created_by)
            staff_id = req.user.id
            agentId = req.user.created_by
            deposit_by = 'staff'

            /* const [agentId] = `SELECT agent_id FROM Agent WHERE id = ?`
                 [req.user.created_by];
             console.log(agentId);
             agent_id = req.user.created_by;*/
        }
        console.log(agentId, staff_id);

        const {
            deposited_from,
            deposited_to,
            deposit_type,
            user_id,
            transaction_id,
            payment_way,
            payment_method,
            cheque_issue_date,
            ref,
            amount,
        } = req.body;

        // Execute the SQL INSERT query
        const [rows] = await pool.execute(
            `INSERT INTO deposit_request (deposited_from, deposited_to, deposit_type, user_id, transaction_id, 
             payment_way, payment_method, cheque_issue_date, ref, amount, attachment,agent_id,deposit_by,platform, staff_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)`,
            [deposited_from, deposited_to, deposit_type, user_id, transaction_id, payment_way, payment_method,
                cheque_issue_date, ref, amount, req.url, agentId, deposit_by, platform, staff_id]
        );


        await pool.end();
        return rows
    } catch (error) {
        ///console.log(req.image)
        deleteFile(req.image)
        console.error('Error inserting data:', error);
        return next(new ErrorResponse('Error inserting data', httpStatus.BAD_REQUEST))
    }
};

//  function to get all deposit requests
const getAllDepositRequests = async (req, res, next) => {
    try {
        // Check if the "status" query parameter is present
        //console.log('here')
        //
        console.log(req.query.id)

        let query = 'SELECT * FROM deposit_request';
        if (!req.query.id && !req.query.status) {
            console.log('no query')
            const [rows] = await pool.execute(query)
            return rows
        }
        const {status, id} = req.query;
        //  console.log(req.query.id)

        if (id) {
            // If "id" parameter is provided, fetch a single deposit request by ID
            query = `SELECT * FROM deposit_request WHERE id = ?`;
        } else if (status) {
            // If "status" parameter is provided, filter by  it
            query = `SELECT * FROM deposit_request WHERE status = ?`;

            /*// If status is specified, and id is not provided, add a filter to avoid self-matching
            if (!id) {
                query += ` AND id <> ?`;
            }*/
        }

        // Execute the SQL query
        const [rows] = await pool.execute(query, [id || status]);
        return rows
    } catch (error) {
        console.error(error);
        next(new ErrorResponse(error, httpStatus.NOT_FOUND));
    }
};

// change the status of deposed request

const changeStatusDeposit = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {status, remarks} = req.body;
        const change_status_by = req.user.id
        //console.log(req.user.id)

        // Fetch the existing deposit request status
        const selectQuery = 'SELECT status FROM deposit_request WHERE id = ?';
        const [existingStatusRows] = await pool.execute(selectQuery, [id]);

        if (existingStatusRows.length === 0) {
            deleteFile(req.image)
            return next(new ErrorResponse(`Deposit request with ID ${id} not found`, httpStatus.NOT_FOUND));
        }

        const existingStatus = existingStatusRows[0].status;

        // Check if the existing status and the new status are the same
        if (existingStatus === status) {
            deleteFile(req.image)
            return next(new ErrorResponse(`status  already in ${existingStatus} mode`, httpStatus.CONFLICT))
        }


        // Update the status in the database
        const updateQuery = `UPDATE deposit_request SET status = ?, remarks = ?, 
                     change_status_by = ?, admin_attachment = ? WHERE id = ?`;
        const [result] = await pool.execute(updateQuery, [status, remarks, change_status_by, req.url, id]);


        // Check if a deposit request was updated
        if (result.affectedRows === 0) {
            deleteFile(req.image)
            return next(new ErrorResponse(`Deposit request with ID ${id} not found`, httpStatus.NOT_FOUND));
        }

        // Return a success response
      //  console.log(result)
        return result
    } catch (error) {
        deleteFile(req.image)
        next(error);
    }
};


export const depositService = {

    createDeposit,
    getAllDepositRequests,
    changeStatusDeposit
};