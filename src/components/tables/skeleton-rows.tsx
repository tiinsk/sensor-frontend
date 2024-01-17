import { range } from 'lodash';
import { StyledTd } from './admin-table-row';
import { Skeleton } from '../../assets/loading/skeleton';

const NUM_OF_ROWS = 5;
const NUM_OF_COLS = 7;

export const SkeletonRows = () => {
  const rows = range(NUM_OF_ROWS);
  const cols = range(NUM_OF_COLS);
  return (
    <>
      {rows.map(i => (
        <tr key={i}>
          {cols.map(j => (
            <StyledTd key={`${i}_${j}`}>
              <Skeleton variant="Body" />
            </StyledTd>
          ))}
        </tr>
      ))}
    </>
  );
};
