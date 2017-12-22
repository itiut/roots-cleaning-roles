import React from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import AssignmentsPanel from './AssignmentsPanel';
import { RolesPanel, UsersPanel } from './ItemsListPanel';
import StepPanel from './StepPanel';
import UrlPanel from './UrlPanel';
import { checkedItems, decodeItems, encodeItems, normalizeItem } from './model';
import './App.css';

class App extends React.Component {
  constructor (props) {
    super(props);
    const { roles, users } = decodeItems(window.location);
    this.state = {
      roles, users,
      assignments: []
    };
  }

  get checkedRoles () {
    return checkedItems(this.state.roles);
  }

  get checkedUsers () {
    return checkedItems(this.state.users);
  }

  get currentUrl () {
    return encodeItems(window.location, this.state.roles, this.state.users);
  }

  changeItem (key, index, newItem) {
    const newArray = this.state[key];
    if (newItem) {
      // update or add
      normalizeItem(newItem);
      newArray.splice(index, 1, newItem);
    } else {
      // delete
      newArray.splice(index, 1);
    }
    this.setState({ [key]: newArray });
  }

  swapItems (key, i, j) {
    if (i < 0 || j >= this.state[key].length) {
      return;
    }
    const newArray = this.state[key];
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    this.setState({ [key]: newArray });
  }

  assignRoles () {
    const checkedRoles = this.checkedRoles;
    const checkedUsers = this.checkedUsers;
    if (checkedRoles.length > checkedUsers.length) {
      return;
    }
    while (checkedRoles.length < checkedUsers.length) {
      checkedRoles.push({ value: '' });
    }
    const assignments = checkedUsers.map(({ id, value }) => {
      const i = Math.floor(Math.random() * checkedRoles.length);
      const role = checkedRoles.splice(i, 1)[0];
      return { id, user: value, role: role.value };
    });
    this.setState({ assignments });
  }

  render () {
    const nCheckedRoles = this.checkedRoles.length;
    const nCheckedUsers = this.checkedUsers.length;
    const canAssign = nCheckedRoles > 0 && nCheckedUsers > 0 && nCheckedRoles <= nCheckedUsers;
    return (
      <Container>
        <Header as='h1' content='掃除の割り当て' dividing />
        <StepPanel />
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <UsersPanel items={this.state.users} changeItem={this.changeItem.bind(this, 'users')} swapItems={this.swapItems.bind(this, 'users')} />
            </Grid.Column>
            <Grid.Column>
              <RolesPanel items={this.state.roles} changeItem={this.changeItem.bind(this, 'roles')} swapItems={this.swapItems.bind(this, 'users')}
                error={nCheckedRoles > nCheckedUsers}
              />
            </Grid.Column>
            <Grid.Column>
              <AssignmentsPanel assignments={this.state.assignments} canAssign={canAssign} assignRoles={this.assignRoles.bind(this)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <UrlPanel value={this.currentUrl} />
      </Container>
    );
  }
}

export default App;
