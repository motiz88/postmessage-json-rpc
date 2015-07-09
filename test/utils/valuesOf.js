export default function valuesOf(obj)
{
	return Object.getOwnPropertyNames(obj).map(name => obj[name]);
}