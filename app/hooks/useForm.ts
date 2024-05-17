import type { Issue } from '~/types';
import { createProvidableHook } from '~/utils/createProvidableHook';

type Props = {
  issues: Issue[]
};

export const useForm = createProvidableHook(({ issues }: Props) => ({
  issues
}), {
  issues: []
});
