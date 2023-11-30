
import React, { useEffect, useState } from 'react';
import { Modal, Button, Radio, Input, TimePicker, Rate, Badge, Calendar, Card } from 'antd';
import { PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
import dayjs from 'dayjs';
import './CalenderView.css';


function CreateEventModal(props) {
  const [activityType, setActivityType] = useState('');
  const [intensity, setIntensity] = useState(0);
  const [time, setTime] = useState(dayjs("00:00", "HH:mm"));
  const [length, setLength] = useState(dayjs("00:00", "HH:mm"));

  const handleActivityTypeChange = (e) => {
    console.log(e.target.value);
    setActivityType(e.target.value);
  };

  const handleIntensityChange = (e) => {
    console.log(e);
    setIntensity(e);
  };

  const handleTimeChange = (e) => {
    console.log(e.format("HH:mm"));
    setTime(e);
  };

  const handleLengthChange = (e) => {
    console.log(e.format("HH:mm"));
    setLength(e);
  };

  const handleOk = () => {
    // Handle saving the activity data
    props.AddEvent(props.sellectedDate, activityType, intensity, length.format("HH:mm"), time.format("HH:mm"));
    console.log(props.sellectedDate, activityType, intensity, length.format("HH:mm"), time.format("HH:mm"));
    props.onOk();
  };

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Modal
      title="Create Activity"
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <FormItem label="Activity Type">
          <Radio.Group onChange={handleActivityTypeChange}>
              <Radio.Button value="Run">Run</Radio.Button>
              <Radio.Button value="Swim">Swim</Radio.Button>
              <Radio.Button value="Ride">Ride</Radio.Button>
          </Radio.Group>
      </FormItem>

      <FormItem label="Intensity">
          <Rate character="❤️" allowHalf allowClear={true} onChange={handleIntensityChange}/>
      </FormItem>

      <FormItem label="Length - Start Time">
      <TimePicker
        format="HH:mm"
        showNow={false}
        minuteStep={1}
        placeholder="Length"
        className='margin-right: 10px;'
        value={length}
        onChange={handleLengthChange}
      />
      <TimePicker
        format="HH:mm"
        minuteStep={1}
        showNow={false}
        placeholder="Start Time"
        value={time}
        onChange={handleTimeChange}
      />

      </FormItem>
    </Modal>
  );
}

function CalendarView() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sellectedDate, setSellectedDate] = useState("");
  const [trainingData, setTrainingData] = useState([ // Ensure to use ID when we have a backend, and integrate that id with the add event and remove event functions
    {"Date": "2023-11-01", "Activity": "Run", "Intensity": 2, "Length": "00:30", "Start Time": "08:00"},
    {"Date": "2023-11-02", "Activity": "Swim", "Intensity": 3, "Length": "00:45", "Start Time": "12:00"},
    {"Date": "2023-11-02", "Activity": "Run", "Intensity": 3, "Length": "00:45", "Start Time": "12:00"},
    {"Date": "2023-11-02", "Activity": "Ride", "Intensity": 2, "Length": "01:00", "Start Time": "16:00"},
    {"Date": "2023-11-05", "Activity": "Run", "Intensity": 2, "Length": "00:30", "Start Time": "08:00"},
    {"Date": "2023-11-03", "Activity": "Swim", "Intensity": 3, "Length": "00:45", "Start Time": "12:00"},
    {"Date": "2023-11-06", "Activity": "Ride", "Intensity": 4, "Length": "01:00", "Start Time": "16:00"},
    {"Date": "2023-11-07", "Activity": "Run", "Intensity": 2, "Length": "00:30", "Start Time": "08:00"},
    {"Date": "2023-11-08", "Activity": "Swim", "Intensity": 3, "Length": "00:45", "Start Time": "12:00"},
    {"Date": "2023-11-07", "Activity": "Ride", "Intensity": 4, "Length": "01:00", "Start Time": "16:00"},
  ]);

  useEffect(() => {
    
    fetch("http://localhost:5000/GetEvent", )
  }, []);

  function AddEvent(date, activity, intensity, length, time) {
    setTrainingData([...trainingData, {"Date": date, "Activity": activity, "Intensity": intensity, "Length": length, "Start Time": time}]);
  }

  const handleRightClick = (e) => {
    e.preventDefault();
    setModalVisible(true);
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  function removeEvent(sellectedActivity) {
    // TODO: Handle backend saving
    setTrainingData(trainingData.filter((activity) => (activity !== sellectedActivity)));
  }


  let activityTypes = ["Run", "Swim", "Ride", "Race"]
  let activityDifficulties = ["Low", "Zone 2", "Mid", "High", "Max Effort"]

  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    var ActivityColors = {
        "Run": "red",
        "Swim": "blue",
        "Ride": "green"
    }

    const formattedDate = current.format('YYYY-MM-DD');
    const activities = trainingData.filter((activity) => activity.Date === formattedDate);
    return (
      <ul className="events" style={{ listStyleType: 'none', padding: '0px', margin: '0px', alignItems: "center" }}>
        {activities.map((activity, index) => (
          <li key={index} style={{ textAlign: 'center' }}>
            <Badge color={ActivityColors[activity.Activity]} ß/>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className='calenderContainer'>
        <Calendar onContextMenu={handleRightClick} onSelect={(date, { source }) => {
          if(source == "date") {
              setSellectedDate(date.format('YYYY-MM-DD'));
          }}}
          fullscreen={false}
          cellRender={cellRender}
          className="mainCalendar"
          />

        <CreateEventModal
          title="Create Activity"
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          AddEvent={AddEvent}
          sellectedDate={sellectedDate}
        />
      </div>
                  
      <div className='CardHolder'>
          {
            trainingData.filter((activity) => activity.Date === sellectedDate).map((activity) => (
              <Card title={activity.Activity} style={{ width: 300 }}>
                  <p>Start Time: {activity["Start Time"]}</p>
                  <p>Length: {activity.Length}</p>
                  <p>Intensity: {activity.Intensity}/5</p>
                  <Button type="primary" ghost onClick={() => {removeEvent(activity)}}><DeleteTwoTone /></Button>
              </Card>
            ))
          }
          <Card title="Add Event" className='AddEvent'>
            <div className='AddEventButton'>
              <Button onClick={() => {setModalVisible(true);}}>
                <PlusCircleTwoTone/>
              </Button>
            </div>
          </Card>
      </div>
    </>
  );
};

export default CalendarView;
