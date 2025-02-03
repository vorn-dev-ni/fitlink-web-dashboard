import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { currentUserLocationAtom } from 'atom';
import { useGoogleMap } from 'hooks/api/useGoogleMap';
import { useAtomValue } from 'jotai';
import { memo, useEffect, useRef, useState } from 'react';
import config from 'utils/config/config';

const center = {
  lat: -3.745,
  lng: -38.523
};

const MapPicker = ({ type, initValue, onChangeAddress }) => {
  const currentLocationLng = useAtomValue(currentUserLocationAtom);
  const [marker, setMarker] = useState({
    lat: '',
    lng: ''
  });

  const initMapRef = useRef(null);
  const googleMapResult = useGoogleMap({ lat: marker.lat, lng: marker.lng });
  const [initDefault, setInitDefault] = useState(null);
  const { palette } = useTheme();
  const mapRef = useRef(null);

  useEffect(() => {
    if (type == 'default' && initMapRef.current != null) {
      return;
    }
    setMarker({
      lat: type == 'update' ? initValue.lat : currentLocationLng.latitude || center.lat,
      lng: type == 'update' ? initValue.lng : currentLocationLng.longtitude || center.lng
    });
    initMapRef.current = initValue;
  }, [currentLocationLng, initValue, type, initMapRef.current]);

  useEffect(() => {
    if (googleMapResult.data != null) {
      onChangeAddress(googleMapResult.data, googleMapResult.lat, googleMapResult.lng);
    }
  }, [googleMapResult.data]);

  if (type == 'update' ? !initValue.lat : !currentLocationLng.latitude) {
    return (
      <Stack direction={'row'} justifyContent={'center'}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <APIProvider apiKey={config.AppEnv.GOOGLE_MAP_API}>
      <Box>
        <Stack sx={{ paddingBottom: 2 }}>
          <Typography>{googleMapResult.Loading ? 'Loading address...' : googleMapResult.data}</Typography>
        </Stack>

        <Map
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={(e) => {
            const latLng = e.detail.latLng;
            console.log('run');
            setMarker({
              lat: latLng.lat,
              lng: latLng.lng
            });
          }}
          mapId={config.AppEnv.MAP_ID}
          style={{ height: '60vh', borderRadius: 100 }}
          defaultCenter={{
            lat: type == 'update' ? initValue.lat : currentLocationLng.latitude,
            lng: type == 'update' ? initValue.lng : currentLocationLng.longtitude
          }}
          fullscreenControl
          zoomControl
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <AdvancedMarker
            position={{
              lat: marker.lat,
              lng: marker.lng
            }}
          >
            <Pin background={palette.primary.dark} borderColor={'#006425'} glyphColor={palette.primary.light} />
          </AdvancedMarker>
        </Map>
      </Box>
    </APIProvider>
  );
};

export default memo(MapPicker);
