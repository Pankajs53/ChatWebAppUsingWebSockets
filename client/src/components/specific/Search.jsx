import React, { useState } from 'react';
import { List, ListItem, ListItemText, Dialog, Stack, DialogTitle, TextField, InputAdornment } from "@mui/material";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from '../shared/UserItem';
import { SampleUsers } from '../../constants/sampleData';



const Search = () => {
  const search = useInputValidation("");

  let isLoadingSednFriendRequest = false;
  const [users,setUsers] = useState(SampleUsers);
  const addFriendhandler = (id) =>{
    console.log(id)
  }

  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <List>
          {
            users.map((user, index) => (
              <UserItem key={index} user={user} handler={addFriendhandler} handlerIsLoading={isLoadingSednFriendRequest} />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
