// Review submission is handled through the bookings endpoint.
// This file re-exports the payload type and provides a dedicated
// reviewApi surface for components that don't want to import booking.api.ts.
export { bookingApi as reviewApi } from './booking.api';
export type { SubmitReviewPayload } from './booking.api';
