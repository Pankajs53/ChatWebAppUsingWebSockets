import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from "../../components/shared/Table";
import { dashboardData } from '../../constants/sampleData';
import { transformImage } from '../../lib/features';
import moment from 'moment';
import { Avatar,Stack } from '@mui/material';

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachment",
    headerClassName: "table-header",
    width: 150,
    renderCell:(params)=><Avatar alt={params.row.name} src={params.row.avatar}/>
  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },

  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 150,
    renderCell:(params)=>(
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
        <span>{params.row.sender.name}</span>
      </Stack>
    )
  },


  {
    field: "chat",
    headerName: "chat",
    headerClassName: "table-header",
    width: 150,
  },

  {
    field: "groupChat",
    headerName: "Groups Chat",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 200,
  },

];


const MessageManagment = () => {

  const [rows,setRows]=useState([]);

  useEffect(()=>{
    setRows(dashboardData.messages.map((i)=>({
      ...i,
      id:i._id,
      sender:{
        name:i.sender.name,
        avatar:transformImage(i.sender.avatar,50),
      },
      createdAt:moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    })))
  },[])

  return (
    <div>
        <AdminLayout>
          <Table heading={"All Messages"} columns={columns} rows={rows}/>
        </AdminLayout>
    </div>
  )
}

export default MessageManagment