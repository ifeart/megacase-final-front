import { loadSmplrJs } from '@smplrspace/smplr-loader'
import { CLIENT_TOKEN, ORGANIZATION_ID } from '../constants'
import type { DeskEntity, RoomEntity } from '../types'

export const loadSmplr = async () => loadSmplrJs('esm')

export const makeQueryClient = async () => {
	const smplr = await loadSmplr()
	return new smplr.QueryClient({
		organizationId: ORGANIZATION_ID,
		clientToken: CLIENT_TOKEN,
	})
}

export const createSpace = async (name: string): Promise<string> => {
	const qc = await makeQueryClient()
	const { sid } = await qc.createSpace({ name })
	try {
		await qc.setSpaceStatus({ spaceId: sid, status: 'published' })
	} catch {
		console.warn(
			'Space created but publish failed; check Authorized domains/CSP/token'
		)
	}
	return sid
}

export const getSpaceIfExists = async (spaceId: string) => {
	const qc = await makeQueryClient()
	try {
		return await qc.getSpace(spaceId, { useCache: false })
	} catch {
		return null
	}
}

export const setSpaceStatusPublished = async (spaceId: string) => {
	const qc = await makeQueryClient()
	await qc.setSpaceStatus({ spaceId, status: 'published' })
}

export const extractRoomsAllLevels = async (
	spaceId: string
): Promise<RoomEntity[]> => {
	const qc = await makeQueryClient()
	const out: RoomEntity[] = []
	for (let levelIndex = 0; levelIndex < 5; levelIndex++) {
		const rooms = await qc
			.getRoomsOnLevel({ spaceId, levelIndex, useCache: true })
			.catch(() => null)
		if (!rooms || !Array.isArray(rooms)) continue
		rooms.forEach((r, idx) => {
			const id = `rm-${levelIndex}-${idx + 1}`
			const name = `Room L${levelIndex + 1}-${idx + 1}`
			out.push({ id, name, levelIndex, coordinates: r.room })
		})
	}
	return out
}

export const extractDesks = async (spaceId: string): Promise<DeskEntity[]> => {
	const qc = await makeQueryClient()
	const furn = await qc.getAllFurnitureInSpace(spaceId)
	return furn.map(f => ({
		id: f.id,
		furnitureId: f.id,
		name: f.name || 'Desk',
		levelIndex: f.levelIndex,
	}))
}
