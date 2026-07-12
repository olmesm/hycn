import "../main"

export default { title: "Components/Presentational Primitives" }

export const Default = () => (
	<hycn-flex direction="column" gap="1rem">
		<hycn-alert>Profile updated successfully.</hycn-alert>
		<hycn-flex align="center" gap=".5rem">
			<hycn-avatar alt="Ada Lovelace" initials="AL" />
			<hycn-text weight="bold">Ada Lovelace</hycn-text>
			<hycn-badge>Admin</hycn-badge>
			<hycn-tag>Mathematics</hycn-tag>
		</hycn-flex>
		<hycn-breadcrumb>
			<a href="#home">Home</a> / <a href="#people">People</a> / Ada
		</hycn-breadcrumb>
		<hycn-card>
			<h2>Analytical Engine</h2>
			<p>A semantic card surface.</p>
			<hycn-button>Read more</hycn-button>
		</hycn-card>
		<hycn-list>
			<li>Accessible</li>
			<li>Typed</li>
			<li>Composable</li>
		</hycn-list>
		<hycn-table label="Project status">
			<table>
				<thead>
					<tr>
						<th>Project</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>HYCN</td>
						<td>Active</td>
					</tr>
				</tbody>
			</table>
		</hycn-table>
		<hycn-icon label="Success">✓</hycn-icon>
		<hycn-image
			alt="Blue placeholder"
			src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect width='100%25' height='100%25' fill='%236b8afd'/%3E%3C/svg%3E"
			width={160}
			height={90}
		/>
		<hycn-skeleton label="Loading profile" />
	</hycn-flex>
)
