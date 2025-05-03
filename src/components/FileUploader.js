import React, { useState } from 'react';

const FileUploader = ({ onFacilitiesUploaded, onSimulationDataUploaded }) => {
  const [facilitiesError, setFacilitiesError] = useState('');
  const [simulationError, setSimulationError] = useState('');

  const handleFacilitiesUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onFacilitiesUploaded(data);
        setFacilitiesError('');
      } catch (error) {
        setFacilitiesError('유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleSimulationUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onSimulationDataUploaded(data);
        setSimulationError('');
      } catch (error) {
        setSimulationError('유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-bold mb-4">데이터 파일 업로드</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            시설 데이터 (JSON):
            <input
              type="file"
              accept=".json"
              onChange={handleFacilitiesUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
            />
          </label>
          {facilitiesError && <p className="text-red-500 text-xs mt-1">{facilitiesError}</p>}
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium">
            시뮬레이션 데이터 (JSON):
            <input
              type="file"
              accept=".json"
              onChange={handleSimulationUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
            />
          </label>
          {simulationError && <p className="text-red-500 text-xs mt-1">{simulationError}</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;