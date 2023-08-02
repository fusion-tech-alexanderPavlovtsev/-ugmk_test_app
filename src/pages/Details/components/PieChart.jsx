import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

import { colors } from '../../../constants';

const COLORS = [colors.green, colors.yellow];

const PieChartDetails = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Legend layout="vertical" verticalAlign="bottom" align="center" />
        <Pie
          data={data}
          cx="50%"
          cy="40%"
          height="300px"
          labelLine={false}
          label
          outerRadius={150}
          fill={colors.white}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartDetails;
