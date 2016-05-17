import cx from 'classnames';
import * as React from 'react';
import List from 'react-list';

import RoomUserRow from './Row';
import GuestsRow from './GuestsRow';

const RoomUserList = ({ className, users, guests }) => {
  const showGuests = guests > 0;
  // The "and X guests" row is implemented somewhat hackily as an extra user
  // row. To render properly at the end of the list, it needs to be rendered as
  // an element of the list--so we tell react-list that we have an extra row
  // when th guests row is shown.
  const length = users.length + (showGuests ? 1 : 0);
  return (
    <div className={cx('UserList', 'UserList--online', className)}>
      <List
        itemRenderer={(index, key) => {
          // The very last row is the guests row
          if (index === users.length) {
            return (
              <GuestsRow
                key={key}
                className="UserList-row"
                guests={guests}
              />
            );
          }
          return (
            <RoomUserRow
              key={key}
              className="UserList-row"
              user={users[index]}
            />
          );
        }}
        length={length}
        type="uniform"
      />
    </div>
  );
};

RoomUserList.propTypes = {
  className: React.PropTypes.string,
  users: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  guests: React.PropTypes.number.isRequired
};

export default RoomUserList;