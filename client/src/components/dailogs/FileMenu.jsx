import React from 'react'
import {Menu} from "@mui/material"

function FileMenu({anchorE1}) {
  return (
    <Menu anchorEl={anchorE1} open={false}>
      <div style={{
        width:"10rem"
      }}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam, doloribus? Expedita sapiente omnis ipsam pariatur odio laborum asperiores, debitis explicabo officia quos est doloremque ex aliquid, eum ut atque nesciunt!
      </div>
    </Menu>
  )
}

export default FileMenu