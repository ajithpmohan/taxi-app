import { toast } from 'react-toastify';

export const TOASTR_OPTIONS = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const updateToast = (trip) => {
  if (trip.status === 'Started') {
    toast.info(
      `Driver ${trip.driver.fullname} is coming to pick you up.`,
      TOASTR_OPTIONS,
    );
  } else if (trip.status === 'In Progress') {
    toast.info(
      `Driver ${trip.driver.fullname} is headed to your destination.`,
      TOASTR_OPTIONS,
    );
  } else if (trip.status === 'Completed') {
    toast.info(
      `Driver ${trip.driver.fullname} has dropped you off.`,
      TOASTR_OPTIONS,
    );
  }
};
