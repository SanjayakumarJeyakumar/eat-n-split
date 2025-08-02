import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Prawin",
    image: "https://i.pravatar.cc/150?img=61",
    balance: -70,
  },
  {
    id: 933372,
    name: "Vishal",
    image: "https://i.pravatar.cc/150?img=11",
    balance: 200,
  },
  {
    id: 499476,
    name: "Sai",
    image: "https://i.pravatar.cc/150?img=13",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFrnd, setSelectedFrnd] = useState(null);

  function handleSelectFrnd(frnd) {
    setSelectedFrnd((cur) => (cur?.id === frnd.id ? null : frnd));
    setShowAddForm(false);
  }

  function handleShowAddForm() {
    setShowAddForm((s) => !s);
  }

  function handleAddFrnd(newFrnd) {
    setFriendList((frnd) => [...frnd, newFrnd]);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriendList((frnds) =>
      frnds.map((frnd) => {
        return frnd.id === selectedFrnd.id
          ? { ...frnd, balance: frnd.balance + value }
          : frnd;
      })
    );

    setSelectedFrnd(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          OnSelection={handleSelectFrnd}
          selectedFrnd={selectedFrnd}
        />

        {showAddForm && (
          <FormAddFriend
            handleAddFrnd={handleAddFrnd}
            setShowAddForm={setShowAddForm}
          />
        )}
        <Button onClick={handleShowAddForm}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFrnd && (
        <FormSplitBill
          selectedFrnd={selectedFrnd}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friendList, OnSelection, selectedFrnd }) {
  return (
    <ul>
      {friendList.map((frnd) => (
        <Friend
          frnd={frnd}
          key={frnd.id}
          OnSelection={OnSelection}
          selectedFrnd={selectedFrnd}
        />
      ))}
    </ul>
  );
}

function Friend({ frnd, OnSelection, selectedFrnd }) {
  const isSelected = selectedFrnd?.id === frnd.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={frnd.image} alt={frnd.name} />
      <h3>{frnd.name}</h3>
      {frnd.balance < 0 && (
        <p className="red">
          You owe {frnd.name} {Math.abs(frnd.balance)}₹{" "}
        </p>
      )}
      {frnd.balance > 0 && (
        <p className="green">
          {frnd.name} owes You {Math.abs(frnd.balance)}₹{" "}
        </p>
      )}
      {frnd.balance === 0 && <p>You owe {frnd.name} are even</p>}{" "}
      <Button onClick={() => OnSelection(frnd)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddFrnd, setShowAddForm }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    setImage("https://i.pravatar.cc/48");
    setName("");

    console.log(newFriend);
    handleAddFrnd(newFriend);
    setShowAddForm((s) => !s);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨‍💻 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🛣️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFrnd, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoPaid, setWhoPaid] = useState("user");
  const frndExpense = bill ? bill - userExpense : "";

  function handleSplit(e) {
    e.preventDefault();
    handleSplitBill(whoPaid === "user" ? frndExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>Split a bill with {selectedFrnd.name}</h2>

      <label>💵 BIll value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>💀 Your expense</label>
      <input
        type="number"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFrnd.name}'s expense</label>
      <input type="text" disabled value={frndExpense} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFrnd.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
