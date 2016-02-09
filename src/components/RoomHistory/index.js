import cx from 'classnames';
import React from 'react';

import Overlay from '../Overlay';
import OverlayHeader from '../Overlay/Header';
import MediaList from '../MediaList';
import AddToPlaylistAction from '../MediaList/Actions/AddToPlaylist';

import HistoryRow from './Row';

const RoomHistory = ({ className, onCloseOverlay, onOpenAddMediaMenu, ...props }) => {
  return (
    <Overlay
      className={cx('RoomHistory', 'AppColumn', 'AppColumn--full', className)}
      direction="top"
    >
      <OverlayHeader
        direction="top"
        className="AppRow AppRow--top"
        title="History"
        onCloseOverlay={onCloseOverlay}
      />
      <div className="RoomHistory-body AppRow AppRow--middle">
        <MediaList
          {...props}
          className="RoomHistory-list"
          rowComponent={HistoryRow}
          makeActions={(media, selection) => [
            <AddToPlaylistAction
              key="add"
              onAdd={position => onOpenAddMediaMenu(position, media, selection)}
            />
          ]}
        />
      </div>
    </Overlay>
  );
};

export default RoomHistory;
