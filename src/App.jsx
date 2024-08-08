import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';

function Button({ children, onClickfunc = null }) {
  return (
    <button className='button' onClick={onClickfunc}>
      {children}
    </button>
  );
}

function App() {
  const initialFriends = [
    {
      id: 118836,
      name: 'Clark',
      image: 'https://i.pravatar.cc/48?u=118836',
      balance: -7,
    },
    {
      id: 933372,
      name: 'Sarah',
      image: 'https://i.pravatar.cc/48?u=933372',
      balance: 20,
    },
    {
      id: 499476,
      name: 'Anthony',
      image: 'https://i.pravatar.cc/48?u=499476',
      balance: 0,
    },
  ];

  const [friends, setFriends] = useState([...initialFriends]);

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFreind, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((prev) => [...prev, newFriend]);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend?.id ? null : friend));
    setShowAddFriend(false);
  }

  function handlesSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFreind.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFreind={selectedFreind}
        />
        <Button onClickfunc={() => setShowAddFriend((prev) => !prev)}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
        {showAddFriend && <FormAddFriend onHandleAddFriend={handleAddFriend} />}
      </div>
      {selectedFreind && (
        <FormSplitBill
          selectedFriend={selectedFreind}
          friends={friends}
          onSplitBill={handlesSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFreind }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectedFreind={selectedFreind}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFreind }) {
  const curFriend = friend.id === selectedFreind?.id;
  console.log(curFriend);

  return (
    <li key={friend.id} className={curFriend ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          {' '}
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you {friend.balance}
        </p>
      )}

      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClickfunc={() => onSelection(friend)}>
        {!curFriend ? 'Select' : 'Close'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onHandleAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    let id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onHandleAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className='form-add-friend ' onSubmit={handleSubmit}>
      <label> Friend name:</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill - paidByUser;

  const [whoIsPaid, setWhoIsPaid] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaid === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form action='' className='form-split-bill ' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label> 💰 Bill value </label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name}'s expense</label>
      <input type='text' disabled value={paidByFriend} />

      <label htmlFor=''>Who is paying the bill</label>
      <select
        name=''
        id=''
        value={whoIsPaid}
        onChange={(e) => setWhoIsPaid(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='Friend'>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
