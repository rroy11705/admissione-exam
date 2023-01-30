import { Button, Stack, TextInput } from '@mantine/core';
import Script from 'next/script';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import PlacesAutocomplete, { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import { RequestAddress } from '../../types';

const GooglePlacesAutocomplete: React.FC = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [address, setAddress] = React.useState('');

  const form = useFormContext();
  const formattedAddress: string = form.getValues('address.formattedAddress');

  const handleSelect = async (value: string, placeId: string) => {
    const [result] = await geocodeByPlaceId(placeId);

    const coordinates = await getLatLng(result);

    const addressDetails: RequestAddress = {
      formattedAddress: value,
      city: '',
      state: '',
      country: '',
      coordinates: {
        lat: 0,
        lng: 0,
      },
    };

    addressDetails.coordinates = {
      lat: coordinates.lat,
      lng: coordinates.lng,
    };

    addressDetails.locality =
      result.address_components.find(component => component.types.includes('sublocality_level_3'))
        ?.long_name ??
      result.address_components.find(component => component.types.includes('sublocality_level_2'))
        ?.long_name ??
      result.address_components.find(component => component.types.includes('sublocality_level_1'))
        ?.long_name;

    addressDetails.city =
      result.address_components.find(component =>
        component.types.includes('administrative_area_level_3'),
      )?.long_name ?? '';

    addressDetails.state =
      result.address_components.find(component =>
        component.types.includes('administrative_area_level_1'),
      )?.long_name ?? '';

    addressDetails.country =
      result.address_components.find(component => component.types.includes('country'))?.long_name ??
      '';

    const zipCode =
      result.address_components.find(component => component.types.includes('postal_code'))
        ?.long_name ?? '';

    addressDetails.zipCode = typeof zipCode === 'string' ? Number(zipCode) : undefined;

    form.setValue('address', addressDetails);
    setAddress(formattedAddress);
  };

  return (
    <div>
      <Script
        title="googlemapsapi"
        onLoad={() => setIsLoaded(true)}
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      />

      {isLoaded ? (
        <PlacesAutocomplete
          value={address !== '' ? address : formattedAddress}
          onChange={value => setAddress(value)}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <TextInput
                {...getInputProps()}
                type="text"
                label="Address"
                placeholder="Address"
                mb="md"
                required
                className="block"
                autoComplete="none"
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => (
                  <Stack {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                    <Button
                      variant="subtle"
                      px="md"
                      py="xs"
                      color="dark"
                      styles={() => ({
                        inner: {
                          width: '100%',
                        },
                        label: {
                          textAlign: 'left',
                          width: '100%',
                        },
                      })}
                      fullWidth
                    >
                      {suggestion.description}
                    </Button>
                  </Stack>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      ) : null}
    </div>
  );
};

export default GooglePlacesAutocomplete;
