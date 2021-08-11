import React from 'react';

interface IProps {
  name?: string;
  percentage: number;
}

const ProgressBar: React.VFC<IProps> = ({ name, percentage }) => {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2  rounded-full text-gray-600 bg-gray-200">
            {name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-gray-600">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 ">
        <div
          style={{ width: percentage + '%' }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
        ></div>
      </div>
    </div>
  );
};
export default ProgressBar;
