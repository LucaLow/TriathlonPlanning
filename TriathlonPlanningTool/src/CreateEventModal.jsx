import React, { useEffect, useState } from "react";
import { Modal, Radio, Input, TimePicker, Rate, Segmented } from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import "./CalenderView.css";

function CreateEventModal(props) {
  const [activityType, setActivityType] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [time, setTime] = useState(dayjs("00:00", "HH:mm"));
  const [length, setLength] = useState(dayjs("00:00", "HH:mm"));
  const [exercistType, setExercistType] = useState("Workout");
  const [raceName, setRaceName] = useState("");
  const [raceType, setRaceType] = useState("");

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
    props.AddEvent(
      props.sellectedDate,
      activityType,
      intensity,
      length.format("HH:mm"),
      time.format("HH:mm"),
      raceName,
      raceType,
      exercistType
    );
    console.log(
      props.sellectedDate,
      activityType,
      intensity,
      length.format("HH:mm"),
      time.format("HH:mm"),
      raceName,
      raceType,
      exercistType
    );
    props.onOk();
  };

  const handleCancel = () => props.onCancel();
  const handleRaceNameChange = (e) => setRaceName(e.target.value);
  const handleRaceTypeChange = (e) => setRaceType(e.target.value);

  return (
    <Modal
      title="Create Activity"
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Segmented
        block
        className="activitySelect"
        options={["Workout", "Race"]}
        value={exercistType}
        onChange={setExercistType}
      />
      {(exercistType == "Workout" && (
        <>
          <FormItem label="Activity Type">
            <Radio.Group onChange={handleActivityTypeChange}>
              <Radio.Button value="Run">Run</Radio.Button>
              <Radio.Button value="Swim">Swim</Radio.Button>
              <Radio.Button value="Ride">Ride</Radio.Button>
            </Radio.Group>
          </FormItem>

          <FormItem label="Intensity">
            <Rate
              character="❤️"
              allowHalf
              allowClear={true}
              onChange={handleIntensityChange}
            />
          </FormItem>

          <FormItem label="Length - Start Time">
            <TimePicker
              format="HH:mm"
              showNow={false}
              minuteStep={1}
              placeholder="Length"
              className="margin-right: 10px;"
              value={length}
              needConfirm={false}
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
        </>
      )) || (
        <>
          <FormItem>
            <h4>Race Name</h4>
            <Input onChange={handleRaceNameChange} size="large" />
            <h4>Race Type</h4>
            <Radio.Group onChange={handleRaceTypeChange}>
              <Radio.Button value="Run">Run</Radio.Button>
              <Radio.Button value="Swim">Swim</Radio.Button>
              <Radio.Button value="Ride">Ride</Radio.Button>
              <Radio.Button value="Triathlon">Triathlon</Radio.Button>
              <Radio.Button value="Duathlon">Duathlon</Radio.Button>
            </Radio.Group>
          </FormItem>
        </>
      )}
    </Modal>
  );
}

export default CreateEventModal;
