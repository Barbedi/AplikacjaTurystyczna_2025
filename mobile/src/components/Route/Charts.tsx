
import { Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts"

const rawData = [
  { value: 895, label: '0 km' },
  { value: 920, label: '' },
  { value: 910, label: '' },
  { value: 950, label: '' },
  { value: 980, label: '0.75 km' },
  { value: 1020, label: '' },
  { value: 1045, label: '' },
  { value: 1050, label: '' },
  { value: 1100, label: '1.5 km' },
  { value: 1150, label: '' },
  { value: 1200, label: '' },
  { value: 1280, label: '2.25 km' },
  { value: 1320, label: '' },
  { value: 1360, label: '' },
  { value: 1420, label: '2.85 km' },
];


const Charts = () => {
    return (
        <>
        <Text className="text-white text-lg">
                        Profil wysokościowy
                    </Text>
        
                    <LineChart
                    
          data={rawData}
          areaChart
          curved
          thickness={3}
        
          color="#A855F7"
          startFillColor="#A855F7"
          endFillColor="#232D4B"
          startOpacity={0.25}
          endOpacity={0.05}
        
          hideDataPoints={true}
        
          xAxisColor="transparent"
          xAxisLabelTextStyle={{ color: '#cbd5e1', fontSize: 11 }}
        
          yAxisColor="transparent"
          yAxisTextStyle={{ color: '#94a3b8', fontSize: 11 }}
        
          rulesColor="#ffffff"
          rulesType="solid"
          
          yAxisOffset={800}
          initialSpacing={0}
          spacing={28}
        />
        </>
    );
};
export default Charts;